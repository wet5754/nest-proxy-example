import { All, Controller, Next, Req, Res, UseGuards } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import { Agent } from 'http';
import * as httpProxy from 'http-proxy';
import { AppService } from './app.service';
import { CommunityAuthGuard } from './guards/community.guard';

@Controller('proxy')
export class ProxyController {
  private proxy: httpProxy;

  constructor(private readonly appService: AppService) {
    this.proxy = httpProxy
      .createProxyServer({
        changeOrigin: true,
        target: 'http://localhost',
        agent: new Agent({
          keepAlive: true,
        }),
      })
      .on('proxyReq', (proxyReq) => {
        proxyReq.path = proxyReq.path.replace(/^\/proxy/, '');
      });
  }

  @All('*')
  @UseGuards(CommunityAuthGuard)
  async allProxy(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const user = (req as any).user;

    const token = user.id
      ? await this.appService.issueJWT(user.id.toString())
      : null;

    try {
      this.proxy.web(
        req,
        res,
        {
          headers: {
            // 유저 정보가 존재하는 경우에만 헤더 추가
            ...(token && {
              authorization: `Bearer ${token}`,
            }),
          },
        },
        next,
      );
    } catch (err) {
      next(err);
    }
  }
}
