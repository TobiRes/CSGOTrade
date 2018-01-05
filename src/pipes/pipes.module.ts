import { NgModule } from '@angular/core';
import { NoSanitizePipe } from './no-sanitize/no-sanitize';
@NgModule({
	declarations: [NoSanitizePipe],
	imports: [],
	exports: [NoSanitizePipe]
})
export class PipesModule {}
