import joi from 'joi'

export const signUp = {
    body: joi.object().required().keys({
        first_name: joi.string().min(2).max(10).required(),
        last_name: joi.string().min(2).max(10).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        age: joi.number(),
    })
}

export const signIn = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

export const confirmEmail = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })
}

export const forgetPassword = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
    })
}

export const recoverPassword = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        newPassword: joi.string().required(),
        code: joi.string().required(),
    })
}