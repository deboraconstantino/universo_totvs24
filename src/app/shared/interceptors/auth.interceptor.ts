import type { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

let auth: string;
let authReq: HttpRequest<any>;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  authReq = req;
  const token = sessionStorage['ERPTOKEN'];

  if (!token) { // Atualizar o token api /api/oauth2/v1/token
    auth = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MTg2NDI2NDUsInVzZXJpZCI6IjAwMDAwMCIsImV4cCI6MTcxODY0NjI0NSwiZW52SWQiOiJQMTIxMjQxMFNJU1QifQ.Dqi8ZbXUEuGJ7J3nD59fZB-042xjvBuR_RSYOGZQ1JVPhPhPtLLzo33kGWdFyWo0aLZe839oQEQCPf9XKCVQEL9nszppZkGfa99U9xwd0MjTUZff2Jw0smehvR9Tg8eZLvSi07qqzGwR0sgVMHMEwRJSsk8SgsVCTHNHQ8hLYw-SDPGPK18gksFJLPAM0mxAk5T8c-aSjTVEIBIVGL15T-pkpDmVBc3cIJo5w18ap5AY7bRinx2wVmPCUybunps_sZbNhumZywenG2AoQrrCGCo2bE5-joBy6reyreO6uC4Uj47mXASeACQWigUWqngf7VdDP_MEHeQM6dNWZN85uw';
    authReq = req.clone({ setHeaders: {Authorization: 'Bearer ' + auth} });
  }

  return next(authReq);
}
