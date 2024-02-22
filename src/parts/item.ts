import { Color, Mesh, MeshBasicMaterial, Shape, ShapeGeometry, Vector2 } from "three"
import { MyObject3D } from "../webgl/myObject3D"
import { Util } from "../libs/util";
// import { Val } from "../libs/val";
// import { Tween } from "../core/tween";
import { MousePointer } from "../core/mousePointer";
import { Func } from "../core/func";

export class Item extends MyObject3D {

  private _mesh: Array<Mesh> = []
  // private _baseCol: Color
  // private _tgCol: Color
  // private _flushVal: Val = new Val(0)
  // private _speed: number = 1
  // private _ease: number = Util.random(0.05, 0.1)
  private _center: Vector2 = new Vector2()

  constructor(_id:number, v0:Vector2, v1:Vector2, v2:Vector2) {
    super()


    // this._c = Util.randomInt(0, 1000)
    this._c = _id * 0.5
    // this._speed = 1 * (Util.hit(2) ? 1 : -1)

    const center = this._getCenter(v0, v1, v2)
    this._center.set(center.x, center.y)

    const newV0 = v0.clone()
    const newV1 = v1.clone()
    const newV2 = v2.clone()

    // this._baseCol = new Color(0x000000).offsetHSL(Util.random(0, 0.5), 1, 0.5)
    // this._tgCol = new Color(0x000000).offsetHSL(Util.random(0, 1), 1, 0)

    const offsetRange = Util.random(0.01, 0.3)
    const num = 2
    for(let i = 0; i < num; i++) {
      const offset = Util.map(i, 0, offsetRange, 0, num)

      newV0.x += (center.x - newV0.x) * offset
      newV0.y += (center.y - newV0.y) * offset

      newV1.x += (center.x - newV1.x) * offset
      newV1.y += (center.y - newV1.y) * offset

      newV2.x += (center.x - newV2.x) * offset
      newV2.y += (center.y - newV2.y) * offset

      const shape = new Shape();
      shape.moveTo(newV0.x, newV0.y);
      shape.lineTo(newV1.x, newV1.y);
      shape.lineTo(newV2.x, newV2.y);
      shape.lineTo(newV0.x, newV0.y);
      const geo = new ShapeGeometry(shape);

      // const col = this._baseCol.clone().offsetHSL(0, 0, Util.map(i, 0, -1, 0, num))
      const col = new Color([0x000000, 0xffffff][i])
      // const col = new Color(0x000000).offsetHSL(Util.random(0.5, 0.75), 1, 0.5)

      const m = new Mesh(
        geo,
        new MeshBasicMaterial({
          color:col,
          transparent:true,
          opacity: 1,
        })
      )
      this.add(m)
      this._mesh.push(m)
    }

    this._resize()
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    // this._flushVal.val = Util.map(Math.sin(this._c * 0.1 * this._speed), 0, 1, -1, 1)

    // const col = this._baseCol.clone().lerp(this._tgCol, this._flushVal.val)
    // ;(this._mesh.material as MeshBasicMaterial).color = col
    // ;(this._mesh.material as MeshBasicMaterial).opacity = Util.map(this._flushVal.val, 0, 1, 0, 1)



    const sw = Func.sw()
    const sh = Func.sh()
    const mx = MousePointer.instance.normal.x * sw * 0.5
    const my = MousePointer.instance.normal.y * sh * -0.5
    const d = this._center.distanceTo(new Vector2(mx, my))

    const area = sw * 0.15

    const s = Util.map(d, 1.1, 1, 0, area)
    this.scale.set(s, s, s)

    const noise = 10
    const noiseOffset = Util.map(d, 1, 0, 0, area)
    const noiseX = Util.range(noise) * noiseOffset
    const noiseY = Util.range(noise) * noiseOffset

    const range = Util.map(d, 1, 0, 0, area) * 0.5
    this.position.x = range * (mx - this._center.x) * -1 + noiseX
    this.position.y = range * (my - this._center.y) * -1 + noiseY
  }

  //
  private _getCenter(pA:Vector2, pB:Vector2, pC:Vector2):any {
    const a = pB.distanceTo(pC)
    const b = pC.distanceTo(pA)
    const c = pA.distanceTo(pB)

    const p = a + b + c

    const x = (a * pA.x + b * pB.x + c * pC.x) / p
    const y = (a * pA.y + b * pB.y + c * pC.y) / p

    const s = p / 2
    const r = Math.sqrt((s - a) * (s - b) * (s - c) / s)

    const max = 0

    return {
        x:x,
        y:y,
        r:r,
        isSoto:(a > max || b > max || c > max)
    }
  }
}