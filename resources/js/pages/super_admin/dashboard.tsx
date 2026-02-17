import { Head } from "@inertiajs/react";

export default function Dashboard() {
  return (
    <>
      <Head title="Super Admin Dashboard" />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Full system control is active.
        </p>
      </div>
    </>
  );
}
