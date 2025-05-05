import {Request, Response} from 'express';
import { hashPassword , comparePasswords} from '../services/password.service';
import prisma from '../models/user'
import { generateToken } from '../services/auth.service';

export const register = async (req: Request, res: Response): Promise<void> => {
    console.log('Entra en register')
    const {email, password} = req.body

    try {

        if (!email) {
            console.log('No email')
            res.status(400).json({message: "El email es obligatorio."})
            return
        }

        if (!password) {
            console.log('No password')
            res.status(400).json({message: "El password es obligatorio."})
            return
        }

        const hashedPassword = await hashPassword(password)
        console.log(hashedPassword)

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        const token = generateToken(user)
        res.status(201).json({token})

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            console.log('Email catch')
            res.status(400).json({error: "El mail ingresado ya existe."})
        }
        console.log(error.message)   
        res.status(500).json({error: "Error en el registro."})
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {

    const {email, password} = req.body

    try {

        if (!email) {
            res.status(400).json({message: "El email es obligatorio."})
            return
        }

        if (!password) {
            res.status(400).json({message: "El password es obligatorio."})
            return
        }

        const user = await prisma.findUnique({where: {email}})
        if(!user){
            res.status(404).json({error: "El usuario no existe."})
            return
        }

            // En user.password está el hash. password es contraseña de entrada.
        const  passwordMatch = await comparePasswords(password, user.password)

        if(!passwordMatch) {
            res.status(401).json({error: "Contraseña No coindiden."})
        }

        const token = generateToken(user)
        res.status(200).json({token})

    } catch (error: any) {
        console.log('Error:' , error)
    }
}