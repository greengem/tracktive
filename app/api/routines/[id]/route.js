import { NextResponse } from 'next/server'
import prisma from '@/prisma/prisma';
import { revalidateTag } from 'next/cache'
import { auth } from "@clerk/nextjs";
import { use } from 'react';

// GET
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const routine = await prisma.workoutPlan.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        notes: true,
        WorkoutPlanExercise: {
          select: {
            Exercise: {
              select: {
                id: true,
                name: true,
              }
            },
            sets: true,
            reps: true,
            exerciseDuration: true,
            order: true,
            trackingType: true
          }
        },
        updatedAt: true,
      }
    });

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 });
    }

    // Normalize the data here
    const normalizedExercises = routine.WorkoutPlanExercise.map(exercise => {
      return {
        ...exercise,
        ...exercise.Exercise
      };
    });

    const normalizedRoutine = {
      ...routine,
      exercises: normalizedExercises
    }

    return NextResponse.json(normalizedRoutine);

  } catch (error) {
    return NextResponse.json({ error: "An error occurred fetching the routine." }, { status: 500 });
  }
}


// DELETE
export async function DELETE(req, context) {
  const { userId } = auth();
  const params = context.params;

  try {
    await prisma.workoutPlan.delete({
      where: {
        id: params.id,
      },
    });

    revalidateTag(`routines_${userId}`);
    return NextResponse.json({ message: "Routine deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting the routine." });
  }
}

// PUT
export async function PUT(request, { params }) {
  const { userId } = auth();
  
  try {
      const data = JSON.parse(await request.text());
      const { routineName, exercises, notes } = data;

      if (!routineName || !Array.isArray(exercises)) {
          return NextResponse.json({ error: "Invalid data format." }, { status: 400 });
      }

      const routineId = params.id;

      await prisma.workoutPlan.update({
          where: { id: routineId },
          data: {
              name: routineName,
              notes: notes,
              WorkoutPlanExercise: {
                  deleteMany: { workoutPlanId: routineId },
                  create: exercises.map((exercise) => ({
                      exerciseId: exercise.id,
                      trackingType: exercise.trackingType,
                      sets: exercise.sets,
                      reps: exercise.reps,
                      exerciseDuration: exercise.exerciseDuration,
                      order: exercise.order,
                  })),
              },
          },
      });

      revalidateTag(`routines_${userId}`);
      return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
      return NextResponse.json({ error: "An error occurred updating the routine." }, { status: 500 });
  }
}
