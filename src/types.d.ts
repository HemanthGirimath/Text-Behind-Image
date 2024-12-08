declare module 'fabric' {
  import { fabric as FabricJS } from 'fabric/fabric-impl';
  export const fabric: typeof FabricJS;
}