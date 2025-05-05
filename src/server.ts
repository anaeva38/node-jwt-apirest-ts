import app from './app'

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server está corriendo en puerto: ${PORT}`);
})