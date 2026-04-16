const gachaService = require('./gacha-service');
const usersService = require('../users/users-service');
const usersRepository = require('../users/users-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');
const { hashPassword } = require('../../../utils/password');

// Fungsi baru: register dan langsung dapet ID
async function registerAndSpin(request, response, next) {
  try {
    // Ubah snake_case ke camelCase
    const { email, password, fullName, confirmPassword } = request.body;

    if (!email || !password || !fullName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
        'Email, password, and fullName required'
      );
    }

    if (password !== confirmPassword) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'Password not match');
    }

    const existingUser = await usersService.emailExists(email);
    if (existingUser) {
      throw errorResponder(errorTypes.CONFLICT, 'Email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await usersRepository.createUser(
      email,
      hashedPassword,
      fullName
    );

    const userId = newUser.id.toString();

    const result = await gachaService.doSpin(userId, fullName);

    return response.status(201).json({
      success: true,
      message: 'User registered and spin completed YAY',
      data: {
        user: {
          id: userId,
          email: newUser.email,
          fullName: newUser.fullName,
        },
        spinResult: result,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function spin(request, response, next) {
  try {
    const { id } = request.body;

    if (!id) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'id wajib diisi yak');
    }

    const user = await usersService.getUser(id);
    if (!user) {
      throw errorResponder(errorTypes.NOT_FOUND, 'oh no User tidak ditemukan');
    }

    const result = await gachaService.doSpin(id, user.fullName);

    return response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function history(request, response, next) {
  try {
    const { id } = request.params;

    if (!id) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'id wajib diisi yak');
    }

    const result = await gachaService.getHistory(id);

    return response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function quota(request, response, next) {
  try {
    const result = await gachaService.getRemainingQuota();
    return response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function winners(request, response, next) {
  try {
    const { prizeId } = request.query;
    const result = await gachaService.getWinners(prizeId);
    return response.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  registerAndSpin,
  spin,
  history,
  quota,
  winners,
};
// 0066
