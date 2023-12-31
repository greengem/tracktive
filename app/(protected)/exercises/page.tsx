import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import getExercises from '@/app/lib/getExercises';
import getUserFavoriteExercises from "@/app/lib/getUserFavoriteExercises";
import getEquipment from "@/app/lib/getEquipment";
import getRoutines from "@/app/lib/getRoutines";
import PageHeading from '@/components/PageHeading/PageHeading';
import ExerciseList from './_components/ExerciseList';
import { EquipmentType, WorkoutPlan, Muscle, CategoryType } from "@prisma/client";

type Exercise = {
  id: string;
  name: string;
  primary_muscles: Muscle[];
  secondary_muscles: Muscle[];
  equipment: EquipmentType | null;
  category: CategoryType;
  image: string | null;
};

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>No user session available</div>;
  }

	const userId = session?.user?.id;
  const favoriteExercises = await getUserFavoriteExercises(userId);
  const myEquipment: EquipmentType[] = await getEquipment(userId);
  const myRoutines: WorkoutPlan[] = await getRoutines(userId);
  const exercises: Exercise[] = await getExercises();
  

  return (
    <>
      <PageHeading title="Exercises" />
      <ExerciseList exercises={exercises} favoriteExercises={favoriteExercises} myEquipment={myEquipment} myRoutines={myRoutines}  />
    </>
  );
}
