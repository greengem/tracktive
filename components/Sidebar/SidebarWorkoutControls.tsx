"use client"
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { useWorkoutControls } from '@/contexts/WorkoutControlsContext';
import { Button, Divider } from '@nextui-org/react';
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

export default function SidebarWorkoutControls() {
    const { isPaused, setIsPaused, workoutDuration, workoutStartTime, formatDuration, activeWorkoutRoutine } = useWorkoutControls();
    const pathname = usePathname();
    const workoutPath = `/workout/${activeWorkoutRoutine}`;
    const formattedStartTime = format(new Date(workoutStartTime), "HH:mm");
    const handlePauseToggle = () => {
        setIsPaused(!isPaused);
    };

    return (
        <>
            {workoutStartTime !== null && (
                <div className='px-5'>
                    <Divider />
                    <div className='px-3 py-3 rounded-lg'>
                        <div className='text-center'>{isPaused ? 'Workout Paused' : 'Active Workout'}</div>
                        <div className={`text-center text-3xl mb-2 tracking-tight ${isPaused ? 'text-warning' : ''}`}>{formatDuration(workoutDuration)}</div>
                        <div className='flex justify-center gap-x-2 mb-2'>
                            <Button color={isPaused ? 'default' : 'warning'} onPress={handlePauseToggle}>
                                {isPaused ? <><IconPlayerPlay />Resume</> : <><IconPlayerPause />Pause</>}
                            </Button>
                        </div>
                        {workoutPath !== pathname && (
                            <div className='text-center text-sm text-success'>
                                <Link href={workoutPath}>View Details</Link>
                            </div>
                        )}
                        <div className='text-center text-xs text-default-500'>Start Time: {formattedStartTime}</div>
                    </div>
                </div>
            )}            
        </>
    )
}
