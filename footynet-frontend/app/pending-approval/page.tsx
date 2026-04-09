'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function PendingApprovalPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center">
      <div className="w-full max-w-sm px-8 text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-1">FootyNet</h1>
          <p className="text-sm text-neutral-500">Club Account Status</p>
        </div>
        <div className="border border-neutral-200 rounded-md bg-white px-6 py-8 mb-6">
          <div className="mb-4">
            <svg
              className="mx-auto h-10 w-10 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-neutral-900 mb-2">Pending Approval</h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Your club account is awaiting admin approval. You will be able to access the platform once an administrator has reviewed and approved your registration.
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full bg-neutral-900 text-white py-2.5 text-sm font-medium rounded-md hover:bg-neutral-700 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
