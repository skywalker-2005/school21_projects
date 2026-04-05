const { Controller, Get, Res } = require('@nestjs/common');
const path = require('path');
const fs = require('fs');

@Controller()
class UiController {
  @Get()
  index(@Res() res) {
    const distPath = path.join(__dirname, '..', 'view', 'index.html');
    const srcPath = path.join(process.cwd(), 'src', 'modules', 'web', 'view', 'index.html');
    const filePath = fs.existsSync(distPath) ? distPath : srcPath;
    const html = fs.readFileSync(filePath, 'utf8');
    res.type('html').send(html);
  }
}

module.exports = {
  UiController,
};
