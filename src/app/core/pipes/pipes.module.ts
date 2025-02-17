import { NgModule } from '@angular/core';
import { ParseHTMLPipe } from './parse-html.pipe';
import { TitleCasePipe } from './title-case.pipe';
import { SummaryPipe } from './summary.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { NumberSeparatorPipe } from './number-separator.pipe';
import { SplitPipe } from './split.pipe';
import { FormatBytesPipe } from './format-bytes.pipe';
import { StripHtmlPipe } from './strip-html.pipe';
import { StripTablePipe } from './strip-table.pipe';
import { ReplaceLineBreaksPipe } from './replace-line-breaks.pipe';

@NgModule({
  declarations: [
    ParseHTMLPipe,
    TitleCasePipe,
    SummaryPipe,
    SafeHtmlPipe,
    NumberSeparatorPipe,
    SplitPipe,
    FormatBytesPipe,
    StripHtmlPipe,
    StripTablePipe,
    ReplaceLineBreaksPipe
  ],
  imports: [],
  exports: [
    ParseHTMLPipe,
    TitleCasePipe,
    SummaryPipe,
    SafeHtmlPipe,
    NumberSeparatorPipe,
    SplitPipe,
    FormatBytesPipe,
    StripHtmlPipe,
    StripTablePipe,
    ReplaceLineBreaksPipe
  ]
})

export class PipesModule { }