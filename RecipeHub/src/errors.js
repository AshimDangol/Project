'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class DuplicateEmailError extends Error {
  constructor(message = 'Email already registered') {
    super(message);
    this.name = 'DuplicateEmailError';
  }
}

class InvalidCredentialsError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  ValidationError,
  DuplicateEmailError,
  InvalidCredentialsError,
  AuthenticationError,
  NotFoundError,
};
