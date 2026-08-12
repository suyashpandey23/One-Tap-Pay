import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import { NotificationProvider } from "./notify/context/NotificationContext";
import "./notify/Notification.css";
import HeaderSkeleton from "./skeletons/HeaderSkeleton";
import MainSectionSkeleton from "./skeletons/MainSectionSkeleton";

const Index = lazy(() => import("./pages/Index"));
const Signin = lazy(() => import("./pages/Signin"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Balance = lazy(() => import("./components/Balance"));
const SendMoney = lazy(() => import("./pages/SendMoney"));
const UpdateAccount = lazy(() => import("./pages/UpdateAccount"));
const TransactionHistory = lazy(() => import("./pages/TransactionHistory"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const RedirectIfAuthenticated = lazy(() =>
  import("./components/RedirectIfAuthenticated")
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Suspense
            fallback={
              <>
                <HeaderSkeleton />
                <MainSectionSkeleton />
              </>
            }
          >
            <Routes>
              <Route exact path="/" element={<Index />} />
              <Route
                path="/signin"
                element={
                  <RedirectIfAuthenticated>
                    <Signin />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path="/signup"
                element={
                  <RedirectIfAuthenticated>
                    <Signup />
                  </RedirectIfAuthenticated>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-account"
                element={
                  <ProtectedRoute>
                    <UpdateAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/balance"
                element={
                  <ProtectedRoute>
                    <Balance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/send"
                element={
                  <ProtectedRoute>
                    <SendMoney />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-history"
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
