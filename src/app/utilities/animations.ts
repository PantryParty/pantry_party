import { trigger, state, transition, style, animate, group } from "@angular/animations";

export const slideInOutDownAnimation = (name = "slideInOut") => trigger(
  name,
  [
    state("in", style({
      opacity: 1,
      transform: "translateY(0) scaleY(1)"
    })),
    state("void", style({
      opacity: 0,
      transform: "translateY(-20%) scaleY(0)"
    })),
    transition("void => *", [animate("1600ms 700ms ease-out")]),
    transition("* => void", [animate("600ms ease-in")])
    // transition(
    //   "in => out",
    //   [
    //     group([
    //       animate("400ms ease-in-out", style({
    //         opacity: "0"
    //       })),
    //       animate("600ms ease-in-out", style({
    //         height: "0px"
    //       }))
    //     ])
    //   ]
    // ),
    // transition(
    //   "out => in",
    //   [
    //     group([
    //       animate("600ms ease-in-out", style({
    //         height
    //       })),
    //       animate("800ms ease-in-out", style({
    //         opacity: "1"
    //       }))
    //     ])
    //   ]
    // )
  ]
);
