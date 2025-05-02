
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Authentication Form */}
      <div className="w-full lg:w-1/3 flex flex-col justify-center px-6 lg:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="block mb-10">
            <h1 className="text-3xl font-bold text-primary">BreezeCRM</h1>
          </Link>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image or Animation */}
      <div className="hidden lg:block lg:w-2/3 bg-gradient-to-br from-primary to-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-2xl text-white">
            <h2 className="text-4xl font-bold mb-6">Manage your customer relationships with ease</h2>
            <p className="text-xl mb-8">
              BreezeCRM gives you all the tools you need to manage leads, track conversations, 
              and grow your business—all in one simple platform.
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Lead Management</h3>
                <p className="text-sm text-white/80">Track leads from initial contact to conversion.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Customer Data</h3>
                <p className="text-sm text-white/80">Store and analyze all customer interactions.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-white/80">Gain insights with powerful reporting tools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
