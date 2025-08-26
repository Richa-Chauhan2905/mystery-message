import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(rquest: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions); //--> returns the currently logged in user
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([ 
        {$match: {id: userId}}, //--> match the messages that has the id of the currently logged in user
        {$unwind: '$messages'}, //--> unwinds all the messages the user has and creates an object of the particular message that has the id as user id and the text message 
        //--> sorted messages are recognized as seperate docs which can be sorted as well
        {$sort: {'messages.createdAt': -1}},
        {$group: {_id: '$_id', messages: {$push: '$messages'}}}
    ])
    if (!user || user.length === 0) {
        return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
        {
          success: true,
          messages: user[0].messages,
        },
        {
          status: 200,
        }
      );
  } catch (error) {
    console.error("Failed to get message", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get message",
      },
      {
        status: 500,
      }
    );
  }

}
