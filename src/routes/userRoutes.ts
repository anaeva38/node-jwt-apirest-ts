import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'
console.log('JWT_SECRET userRoutes: ', JWT_SECRET)

// Middleware 
const authenticateToken = (req: Request, res: Response, next: NextFunction):any => {

    console.log("Entra en middleware autenticateToken ")
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log("authHeader: ", authHeader)
    console.log("token:", token)

    if (!token) {
        return res.status(401).json({error: 'NO autorizado'})
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Error en la autenticación:', err.message)
            return res.status(403).json({error: 'No tienes acceso a este recurso'})
        }

        next();
    })

}

// router.post('/', authenticateToken, () => {return console.log('POST')})
// router.get('/', authenticateToken, () => {return console.log('GET')})
// router.get('/:id', authenticateToken, () => {return console.log('GET ID')})
// router.put('/:id', authenticateToken, () => {return console.log('PUT')})
// router.delete('/:id', authenticateToken, () => {return console.log('DELETE')})

router.post('/', authenticateToken, createUser)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router;