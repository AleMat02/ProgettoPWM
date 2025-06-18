import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { UserRole } from '../interfaces/user.interface';

export function roleGuard(requiredRoles: UserRole[]): CanActivateFn {
    return () => {
        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.user$.pipe(
            take(1), //Come raccomandato dalla documentazione rxjs, usiamo take(1) per prendere solo il primo valore emesso dalla sottoscrizione, evitando leak di memoria
            map(user => {
                console.log(user)
                if (!user) {
                    router.navigate(['/login']);
                    return false;
                }

                if (!requiredRoles.includes(user.role)) {
                    if (requiredRoles.includes(UserRole.Guest)) {
                        router.navigate(['/login']);
                        return false;
                    }

                    router.navigate(['/unauthorized']);
                    return false;
                }

                return true;
            })
        );
    };
}
