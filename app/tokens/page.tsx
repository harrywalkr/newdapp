import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


export default function Token() {
    return (
        <div className="flex flex-col gap-6 items-center justify-center w-full">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
            <Card className="w-full">
                <CardContent className="mt-5">
                    <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="account">Summary</TabsTrigger>
                            <TabsTrigger value="password">Markets</TabsTrigger>
                            <TabsTrigger value="password">Scoring</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">Token summary is here</TabsContent>
                        <TabsContent value="password">Find out more about token markets</TabsContent>
                        <TabsContent value="password">Token scoring and vuln</TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
