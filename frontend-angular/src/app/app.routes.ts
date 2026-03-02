import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './guards';

export const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'jobs',
    loadComponent: () => import('./pages/jobs/job-list/job-list').then((m) => m.JobListComponent),
  },
  {
    path: 'jobs/create',
    loadComponent: () =>
      import('./pages/jobs/job-create/job-create').then((m) => m.JobCreateComponent),
  },
  {
    path: 'jobs/:id',
    loadComponent: () =>
      import('./pages/jobs/job-detail/job-detail').then((m) => m.JobDetailComponent),
  },
  {
    path: 'jobs/:id/proposals',
    loadComponent: () =>
      import('./pages/proposals/job-proposals/job-proposals').then((m) => m.JobProposalsComponent),
  },
  {
    path: 'freelancers',
    loadComponent: () =>
      import('./pages/freelancers/freelancer-list/freelancer-list').then(
        (m) => m.FreelancerListComponent,
      ),
  },
  {
    path: 'freelancers/create',
    loadComponent: () =>
      import('./pages/freelancers/freelancer-create/freelancer-create').then(
        (m) => m.FreelancerCreateComponent,
      ),
  },
  {
    path: 'freelancers/:id',
    loadComponent: () =>
      import('./pages/freelancers/freelancer-profile/freelancer-profile').then(
        (m) => m.FreelancerProfileComponent,
      ),
  },
  {
    path: 'proposals/my-proposals',
    loadComponent: () =>
      import('./pages/proposals/proposal-list/proposal-list').then((m) => m.ProposalListComponent),
  },
  {
    path: 'contracts',
    loadComponent: () =>
      import('./pages/contracts/contract-list/contract-list').then((m) => m.ContractListComponent),
  },
  {
    path: 'contracts/:id',
    loadComponent: () =>
      import('./pages/contracts/contract-detail/contract-detail').then(
        (m) => m.ContractDetailComponent,
      ),
  },
  {
    path: 'me',
    loadComponent: () =>
      import('./pages/profile/my-profile/my-profile').then((m) => m.MyProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },

  // ─── Admin Routes ──────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/admin-login/admin-login').then((m) => m.AdminLoginComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-layout/admin-layout').then((m) => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboardComponent,
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/admin-users/admin-users').then((m) => m.AdminUsersComponent),
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('./pages/admin/admin-jobs/admin-jobs').then((m) => m.AdminJobsComponent),
      },
      {
        path: 'contracts',
        loadComponent: () =>
          import('./pages/admin/admin-contracts/admin-contracts').then(
            (m) => m.AdminContractsComponent,
          ),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./pages/admin/admin-reviews/admin-reviews').then((m) => m.AdminReviewsComponent),
      },
    ],
  },
];
