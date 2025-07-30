import prisma from "../../../../lib/prisma";
import {NextResponse} from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req){
    try{
        const {name,email,password} = await req.json();
        const existingUser = await prisma.user.findUnique({where:{email}})
        if(existingUser){
            return NextResponse.json({message:"Sorry user already exists , please use another email", status:400})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password:hashedPassword
            }
        })

        console.log("User successfully created user", user)

        return NextResponse.json({message:"User signedUp successfully",status:200});
    }catch(err){
        console.log("error in signing up route",err)
        return NextResponse.json({message:"error in signing up", status:400})
    }
}
