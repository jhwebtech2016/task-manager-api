const {tipCalculate,celsiusToFahrenheit,fahrenheitToCelsius,add} = require('../src/maths')

// test('Calculate total with tip', () => {
//         const total = tipCalculate(10,.3)
//         expect(total).toBe(13)
// })

// test('Should calculate total with default tip', () => {
//         const total = tipCalculate(10)
//         expect(total).toBe(12.5)
// })

test('should convert 32 F to 0 C', () => {
        const temp = fahrenheitToCelsius(32)
        expect(temp).toBe(0)
})

test('should convert 0 c to 32 F', () => {
        const temp = celsiusToFahrenheit(0)
        expect(temp).toBe(32)
})

test('Should Add two Number', (done) => {
        add(2, 3).then((sum) => {
                expect(sum).toBe(5)
                done()
        })
        
})

test('Should Add two Number async/await', async () => {
        const sum = await add(10,22)
        expect(32).toBe(sum)
        
})

