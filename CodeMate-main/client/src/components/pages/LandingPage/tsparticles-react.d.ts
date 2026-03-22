declare module "@tsparticles/react" {
  export default function Particles(props: any): JSX.Element
  export function initParticlesEngine(callback: any): Promise<any>
}

declare module "@tsparticles/slim" {
  export function loadSlim(engine: any): Promise<any>
}

