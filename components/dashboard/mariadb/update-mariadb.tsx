import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AlertTriangle, SquarePen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";

const updateMariadbSchema = z.object({
	name: z.string().min(1, {
		message: "Name is required",
	}),
	description: z.string().optional(),
});

type UpdateMariadb = z.infer<typeof updateMariadbSchema>;

interface Props {
	mariadbId: string;
}

export const UpdateMariadb = ({ mariadbId }: Props) => {
	const utils = api.useUtils();
	const { mutateAsync, error, isError, isLoading } =
		api.mariadb.update.useMutation();
	const { data } = api.mariadb.one.useQuery(
		{
			mariadbId,
		},
		{
			enabled: !!mariadbId,
		},
	);
	const form = useForm<UpdateMariadb>({
		defaultValues: {
			description: data?.description ?? "",
			name: data?.name ?? "",
		},
		resolver: zodResolver(updateMariadbSchema),
	});
	useEffect(() => {
		if (data) {
			form.reset({
				description: data.description ?? "",
				name: data.name,
			});
		}
	}, [data, form, form.reset]);

	const onSubmit = async (formData: UpdateMariadb) => {
		await mutateAsync({
			name: formData.name,
			mariadbId: mariadbId,
			description: formData.description || "",
		})
			.then(() => {
				toast.success("MariaDB updated succesfully");
				utils.mariadb.one.invalidate({
					mariadbId: mariadbId,
				});
			})
			.catch(() => {
				toast.error("Error to update the Mariadb");
			})
			.finally(() => {});
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<SquarePen className="size-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Modify MariaDB</DialogTitle>
					<DialogDescription>Update the MariaDB data</DialogDescription>
				</DialogHeader>
				{isError && (
					<div className="flex flex-row gap-4 rounded-lg bg-red-50 p-2 dark:bg-red-950">
						<AlertTriangle className="text-red-600 dark:text-red-400" />
						<span className="text-sm text-red-600 dark:text-red-400">
							{error.message}
						</span>
					</div>
				)}

				<div className="grid gap-4">
					<div className="grid items-center gap-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								id="hook-form-update-mariadb"
								className="grid w-full gap-4 "
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Tesla" {...field} />
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Description about your project..."
													className="resize-none"
													{...field}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
								<DialogFooter>
									<Button
										isLoading={isLoading}
										form="hook-form-update-mariadb"
										type="submit"
									>
										Update
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
