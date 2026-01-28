import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken } from "@/lib/auth-token";

/**
 * POST /api/riddle-creator/vote
 * Vote on a user-submitted riddle (+1 upvote or -1 downvote)
 */
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const userId = token?.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userRiddleId, value } = body;

    if (!userRiddleId || value === undefined) {
      return NextResponse.json(
        { error: "userRiddleId and value are required" },
        { status: 400 }
      );
    }

    // Validate vote value
    if (value !== 1 && value !== -1) {
      return NextResponse.json(
        { error: "Vote value must be 1 (upvote) or -1 (downvote)" },
        { status: 400 }
      );
    }

    // Check if riddle exists
    const riddle = await prisma.userRiddle.findUnique({
      where: { id: userRiddleId },
    });

    if (!riddle) {
      return NextResponse.json({ error: "Riddle not found" }, { status: 404 });
    }

    // Prevent voting on own riddle
    if (riddle.authorId === userId) {
      return NextResponse.json(
        { error: "Cannot vote on your own riddle" },
        { status: 400 }
      );
    }

    // Check for existing vote
    const existingVote = await prisma.userRiddleVote.findUnique({
      where: {
        userRiddleId_userId: {
          userRiddleId,
          userId,
        },
      },
    });

    let newVoteValue = value;
    let voteDelta = value;

    if (existingVote) {
      // If same vote, remove it (toggle off)
      if (existingVote.value === value) {
        await prisma.userRiddleVote.delete({
          where: {
            userRiddleId_userId: {
              userRiddleId,
              userId,
            },
          },
        });
        voteDelta = -value; // Subtract the vote
        newVoteValue = 0; // No vote
      } else {
        // Change vote
        await prisma.userRiddleVote.update({
          where: {
            userRiddleId_userId: {
              userRiddleId,
              userId,
            },
          },
          data: { value },
        });
        voteDelta = value - existingVote.value; // Net change
        newVoteValue = value;
      }
    } else {
      // Create new vote
      await prisma.userRiddleVote.create({
        data: {
          userRiddleId,
          userId,
          value,
        },
      });
      voteDelta = value;
      newVoteValue = value;
    }

    // Update riddle vote counts
    const updatedRiddle = await prisma.userRiddle.update({
      where: { id: userRiddleId },
      data: {
        totalVotes: { increment: voteDelta },
        voteCount: existingVote && existingVote.value === value
          ? { decrement: 1 }
          : !existingVote
          ? { increment: 1 }
          : undefined, // No change if switching vote
      },
    });

    return NextResponse.json(
      {
        success: true,
        userVote: newVoteValue,
        totalVotes: updatedRiddle.totalVotes,
        voteCount: updatedRiddle.voteCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to vote on riddle:", error);
    return NextResponse.json(
      { error: "Failed to vote on riddle" },
      { status: 500 }
    );
  }
}
