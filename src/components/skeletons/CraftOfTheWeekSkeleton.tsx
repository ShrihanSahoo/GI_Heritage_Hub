import { Skeleton } from '@/components/ui/skeleton';

export function CraftOfTheWeekSkeleton() {
    return (
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
             </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-4 pt-4">
                         <Skeleton className="h-10 w-24" />
                         <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </div>
    )
}
