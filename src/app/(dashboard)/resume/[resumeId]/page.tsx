import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ resumeId: string }>;
}

export default async function ResumeIndexPage({ params }: Props) {
  const { resumeId } = await params;
  redirect(`/resume/${resumeId}/personal`);
}
