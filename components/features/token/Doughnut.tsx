'use client'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    title: string,
    tooltip: string,
    data: number[]
}

export default function DoughnutChart({ title, tooltip, data }: Props) {
    return (
        <div className="relative max-w-[16rem] aspect-square flex flex-col items-center justify-center ">
            <HoverCard>
                <HoverCardTrigger className="absolute left-1/2 top-1/2 mx-auto w-[66px] text-center h-4 " style={{ transform: 'translate(-50%, -25%)' }}>{title}</HoverCardTrigger>
                <HoverCardContent>
                    {tooltip}
                </HoverCardContent>
            </HoverCard>
            <Doughnut data={{
                datasets: [
                    {
                        label: "Score",
                        data: data,
                        backgroundColor: [
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 255, 255, 0.2)",
                        ],
                        borderColor: ["rgba(54, 162, 235, 1)"],
                        borderWidth: 1,
                        weight: 0.2
                    },
                ],
            }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: 48

                }}
                className="h-full w-full p-0 m-0"
            />
        </div>
    )
}
