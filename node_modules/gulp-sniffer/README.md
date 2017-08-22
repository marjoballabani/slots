## Information

<table>
<tr>
<td>Package</td><td>gulp-sniffer</td>
</tr>
<tr>
<td>Description</td>
<td>Throw error if the passed function returns true</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

```js
var sniffer = require('gulp-sniffer');

gulp.task('test', function() {
  return gulp.src('./src/*.js')
    .pipe(sniffer({
        'This file has trailing spaces': function(content) {
            return content.match(/( )+\n/g)
        }
    }))
    .pipe(gulp.dest('./dist/'));
});
```

## LICENSE

(MIT License)

Copyright (c) 2015 Christophe Gourmelon <christophe@roparz.me>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
