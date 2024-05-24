"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { verifyKey } from "@/services/auth.service"
import Spinner from "@/components/common/Spinner"

const formSchema = z.object({
    password: z.string()
    // .min(32, {
    //     message: "Password must be at least 32 characters",
    // }).max(32, {
    //     message: "Password must less than 32 characters",
    // }),
})


export default function LoginForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })
    // FIXME: Another 500 error !!!!!
    const { mutate, isPending, isError } = useMutation(
        {
            mutationFn:
                (key: string) => verifyKey(key)
                    .then((data) => {
                        localStorage.setItem("LICENSE_KEY", key);
                        // FIXME: Redirect to the previous page the user is coming from
                        const redirect = '/';
                        router.push(redirect as string);
                    })
                    .catch((error: Error) => {
                        console.error("Error fetching key:", error.message);
                    })
        }
    );

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutate(values.password);
    }


    return (
        <Card className="w-full relative max-w-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    {isPending && <Spinner />}
                    <CardHeader>
                        <CardTitle>Enter your access key</CardTitle>
                        <CardDescription>Login to your Dextrading account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="outline outline-1 outline-muted-foreground/35"
                                            type="password"
                                            placeholder="*********"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your access key
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit">Submit</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card >
    )
}