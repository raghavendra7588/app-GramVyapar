import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EmitterService } from './shared/emitter.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: Window, useValue: window }
  ],
})
export class AppComponent {
  title = 'app-GramVyapar';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private emitterService: EmitterService,
    @Inject(Window) private window: Window,
  ) {
    this.emitterService.isOrderedPlaced.subscribe(value => {
      if (value) {

        this.router.events.subscribe((evt) => {
       
          if (!(evt instanceof NavigationEnd)) {
            return;
          }
          // window.scrollTo(0, 0)
          window.scrollTo({
            top: 0
           });
        });
        window.scroll(0, 0);
      }
      this.onEdit();

    });
    window.scroll(0, 0);
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }


  onEdit() {
    
    this.window.document.getElementById('top').scrollIntoView();
    this.window.document.getElementById('topp').scrollIntoView();
  }

  scrollTop(event) {
   
    window.scroll(0, 0);
   window.scrollTo({
    top: 0
   });

  }
  onFloatClick(){
    this.router.navigate(['/buyProducts/goToCart']);
  }
}
