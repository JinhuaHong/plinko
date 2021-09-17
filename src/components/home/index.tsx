import React from "react";
import Matter, { Bodies } from 'matter-js';
import { FootPage } from "../foot";

interface State {
  canvarRender?: any;
  pegsRow: number;
  ballAmount: number;
  isStart: boolean;
}

export class HomePage extends React.PureComponent<any, State> {

  constructor (props: any) {
    super(props);
    this.state = {
      pegsRow: 12,
      ballAmount: 1,
      isStart: false,
    }
  }

  private homeRef: any = React.createRef();
  private avoidBodyObj: any = {};
  private wallId = 1471204710247182;

  componentDidMount() {
    this.init();
  }

  init = () => {
    // module aliases
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composite = Matter.Composite;

    // create an engine
    var engine = Engine.create();

    Matter.Events.on(engine, 'collisionActive', this.onCollision);

    // create a renderer
    var render = Render.create({
      element: this.homeRef.current,
      engine: engine,
    });

    // create two boxes and a ground
    // var boxA = Bodies.rectangle(400, 200, 80, 80);
    // var boxB = Bodies.rectangle(450, 50, 80, 80);
    // var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // // add all of the bodies to the world
    // Composite.add(engine.world, [boxA, boxB, ground]);
    
    this.avoidBodyObj[this.wallId] = true;
    const bodies: Matter.Body[] = this.renderPegs();
    const bodies2: Matter.Body[] = this.renderBalls();
    const wall: Matter.Body = Matter.Bodies.rectangle(400, 595, 800, 10, {
      id: this.wallId,
      isStatic: true,
      render: {
        fillStyle: 'red'
      }
    });
    Composite.add(engine.world, [...bodies2, ...bodies, wall]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
    this.setState({
      canvarRender: render
    });
  }

  onCollision = (e: any) => {
    console.log(e.pairs[0].bodyA.id, this.state.canvarRender.engine.world.bodies[0].id);
    const body = this.state.canvarRender.engine.world.bodies.filter((item: any) => item.id === e.pairs[0].bodyA.id)[0];
    if (!body) {
      return;
    }
    if (this.avoidBodyObj[body.id]) {
      if (e.pairs[0].bodyB.id && e.pairs[0].bodyB.id === this.wallId) {
        Matter.World.remove(this.state.canvarRender.engine.world, body);
        Matter.Body.setPosition(e.pairs[0].bodyB, {
          x: 0,
          y: 10
        });
      }
      return;
    }
    // Matter.Body.scale(body, 2, 2);
    // setTimeout(() => {
    //   Matter.Body.set(body, 'collisionFilter', {
    //     group: -1
    //   });
    // }, 100);
    
    setTimeout(() => {
      // Matter.Body.set(body, 'collisionFilter', {
      //   group: 10
      // });
      // Matter.Body.scale(body, 0.5, 0.5);
    }, 200);
  }

  renderPegs = () => {
    const bodies: Matter.Body[] = [];
    let x = 400;
    let y = 30;
    const xTemp = 20;
    const yTemp = 30;
    let curRow = 1;
    let instance = 0;
    const pegsAmount = this.state.pegsRow * (5 + this.state.pegsRow) / 2;
    for (let i = 1; i <= pegsAmount; i++) {
      if (i <= (curRow * (5 + curRow) / 2)) {
        const body = Bodies.circle(x + instance, y, 1, {
          isStatic: true,
          render: {
            fillStyle: 'white',
          },
        });
        bodies.push(body);
        instance += 40;
      } else {
        instance = 40;
        curRow += 1;
        x -= xTemp;
        y += yTemp;
        const body = Bodies.circle(x, y, 1, {
          isStatic: true,
          render: {
            fillStyle: 'white'
          }
        });
        bodies.push(body)
      }
    }
    return bodies;
  }

  renderBalls = () => {
    const bodies: Matter.Body[] = [];
    if (!this.state.isStart) {
      return bodies;
    }
    const arr = new Array(this.state.ballAmount).fill(1);
    arr.forEach((item, index) => {
      const id = Number((Math.floor(Math.random() * 100000000) + 1));
      this.avoidBodyObj[id] = true;
      const positionX = Math.floor(Math.random() * 70 + 405);
      var box = Bodies.circle(positionX, 10, 10, {
        id,
        collisionFilter: {
          group: -1
        },
        render: {
          fillStyle: '#0000ff',
          lineWidth: 20
        },
      });
      bodies[index] = box;
    });
    return bodies;
  }

  startGame = () => {
    this.setState({
      isStart: true
    }, () => {
      const bodies: Matter.Body[] = this.renderBalls();
      Matter.World.add(this.state.canvarRender.engine.world, bodies);
    });
  }

  render() {
    return <div>
      <div ref={this.homeRef} />
      <FootPage
        isStart={false}
        ballAmount={this.state.ballAmount}
        begin={this.startGame}
        onChangeBall={(value: number) => {
          this.setState({
            ballAmount: value
          });
        }}
      />
    </div>
  };
}