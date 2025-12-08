import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login-component/login-component';
import { CadastroComponent } from './pages/public/cadastro-component/cadastro-component';
import { DashbardComponent } from './pages/users/dashbard-component/dashbard-component';
import { HomeComponent } from './pages/users/home-component/home-component';
import { LivrosComponent } from './pages/users/livros-component/livros-component';
import { DashboaradmComponent } from './pages/admin/dashboaradm-component/dashboaradm-component';
import { ControlComponent } from './pages/admin/control-component/control-component';
import { RecordComponent } from './pages/admin/record-component/record-component';
import { authGuard, adminGuard, alunoGuard } from './guards/auth.guard';

export const routes: Routes = [

    {
        path: "",
        component: LoginComponent
    },
    {
        path: "cadastro",
        component: CadastroComponent
    },
    {
        path: "users/dashboard",
        component: DashbardComponent,
        canActivate: [authGuard, alunoGuard],
        children:[
            {
                path: '',
                redirectTo:'home',
                pathMatch: 'full'

            },
            {
                path: 'home',
                component: HomeComponent
            },
           {
                path: 'livro',
                component: LivrosComponent
            }
            

        ]

    },{
        path: "admin/dashboardadm",
        component: DashboaradmComponent,
        canActivate: [authGuard, adminGuard],
        children:[
            {
                path: '',
                redirectTo:'control',
                pathMatch: 'full'

            },
            {
                path: 'control',
                component: ControlComponent
            },{
                path: 'record',
                component: RecordComponent
            }
        ]
    }

];
