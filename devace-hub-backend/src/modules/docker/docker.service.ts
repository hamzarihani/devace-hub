import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import Dockerode = require('dockerode');

@Injectable()
export class DockerService {
  private docker: Dockerode;

  constructor() {
    this.docker = new Dockerode({ socketPath: '/var/run/docker.sock' });
  }

  async listContainers() {
    try {
      const containers = await this.docker.listContainers({ all: true });
      return containers.map((container) => ({
        id: container.Id,
        names: container.Names,
        image: container.Image,
        state: container.State,
        status: container.Status,
      }));
    } catch (error: any) {
      throw new InternalServerErrorException(`Failed to list containers: ${error.message}`);
    }
  }

  async startContainer(id: string) {
    try {
      const container = this.docker.getContainer(id);
      await container.start();
      return { message: 'Container started successfully' };
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundException(`Container with ID "${id}" not found`);
      }
      if (error.statusCode === 304) {
        throw new ConflictException(`Container with ID "${id}" is already started`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async stopContainer(id: string) {
    try {
      const container = this.docker.getContainer(id);
      await container.stop();
      return { message: 'Container stopped successfully' };
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundException(`Container with ID "${id}" not found`);
      }
      if (error.statusCode === 304) {
        throw new ConflictException(`Container with ID "${id}" is already stopped`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLogs(id: string): Promise<string> {
    try {
      const container = this.docker.getContainer(id);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: 100,
        follow: false,
      });
      return logs.toString('utf8');
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new NotFoundException(`Container with ID "${id}" not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * For future WebSocket implementation
   */
  async getLogsStream(id: string) {
    const container = this.docker.getContainer(id);
    return container.logs({
      stdout: true,
      stderr: true,
      follow: true,
      tail: 0,
    });
  }
}
