import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  UserCog,
  Users,
  Clock,
  DollarSign,
  CalendarDays,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            BB
          </div>
          <h1 className="text-xl font-bold">Bistro Boardroom</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/login">
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Restaurant Staff Management Made Simple
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Bistro Boardroom streamlines employee scheduling, time
                  tracking, and payroll management for restaurant owners and
                  staff.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link to="/login">
                      Log In
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/signup">Create Account</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="rounded-lg border bg-card p-8 shadow-lg">
                  <div className="space-y-4">
                    <div className="space-y-2 mb-6">
                      <h3 className="text-2xl font-bold">Demo Accounts</h3>
                      <p className="text-sm text-muted-foreground">
                        Try out Bistro Boardroom with these demo accounts
                      </p>
                    </div>
                    <div className="grid gap-6">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">
                              Admin Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Email: admin@bistro.com
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Password: admin123
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="secondary"
                            className="w-full"
                            asChild
                          >
                            <Link to="/login">Login as Admin</Link>
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold mb-1">
                              Employee Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Email: employee@bistro.com
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Password: employee123
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="secondary"
                            className="w-full"
                            asChild
                          >
                            <Link to="/login">Login as Employee</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Why Choose Bistro Boardroom?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our all-in-one platform helps restaurant owners and staff
                  manage schedules, track time, and streamline payroll.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Easy Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Create and manage employee schedules with ease
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track employee hours and overtime accurately
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Payroll Management</h3>
                <p className="text-sm text-muted-foreground">
                  Simplify payroll calculations and processing
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Employee Portal</h3>
                <p className="text-sm text-muted-foreground">
                  Give employees access to their schedules and timesheets
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Bistro Boardroom. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
