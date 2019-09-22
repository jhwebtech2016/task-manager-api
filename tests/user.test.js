const request = require('supertest')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../src/models/users')

const useroneId = new mongoose.Types.ObjectId()
const userone = {
    _id : useroneId,
    name : 'mike',
    email : 'mike@example.com',
    passwords : 'hiren111',
    tokens : [{
        token : jwt.sign({_id : useroneId}, process.env.jwt_secret)
    }]
}

beforeEach(async () => {

        await User.deleteMany()
        await new User(userone).save()
})

test('Should Singnup a new user', async () => {
    const responce = await request(app).post('/users').send({
        name : 'hiren',
        email : 'hiren_hotel@yahoo.com',
        passwords : 'hiren111'
    }).expect(201)

    const user = await User.findById(responce.body.user._id)
    expect(user).not.toBeNull()
    expect(responce.body).toMatchObject({
        user : {
            name : 'hiren',
            email : 'hiren_hotel@yahoo.com'
            
        },
        token : user.tokens[0].token
    }),
    expect(user.password).not.toBe('hiren111')
}) 

test('Should Able to login', async () => {
   const responce = await request(app).post('/users/login').send({
        email : userone.email,
        passwords : userone.passwords
    }).expect(200)

    const user = await User.findById(useroneId)
    expect(responce.body.token).toBe(user.tokens[1].token)
})

test('Non existing user', async () => {
    await request(app).post('/users/login').send({
        email: userone.email,
        passwords: 'olareola'
    }).expect(400)
})

test('Get profile', async() => {
    await request(app).get('/users/me').set('Authorization',`Bearer ${userone.tokens[0].token}`).send().expect(200)
})

test('Unauthorized Access', async() => {
    await request(app).get('/users/me').send().expect(401)
})

test('Delete User Account', async () => {
    await request(app).delete('/users/me').set('Authorization',`Bearer ${userone.tokens[0].token}`).send().expect(200)
    const user = await User.findById(useroneId)
    expect(user).toBeNull()
})

test('Delete User Account', async () => {
    await request(app).delete('/users/me').send().expect(401)
})

test('upload avatar', async () => {
    await request(app).post('/users/me/avatar').set('Authorization',`Bearer ${userone.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
    const user = await User.findById(useroneId)
    expect({}).toEqual({})
})