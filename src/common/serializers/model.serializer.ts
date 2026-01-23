export abstract class ModelSerializer {
  abstract serialize(data: any): any;

  serializeMany(data: any[]): any[] {
    return data.map((item) => this.serialize(item));
  }
}

