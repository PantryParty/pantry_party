import { trigger, state, transition, style, animate, group } from "@angular/animations";

export const slideInOutDownAnimation = [
  trigger(
    "slideInOut",
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
    ]
  )
];

export const slideOutLeftAnimation = trigger(
  "slideLeftOut",
  [
    state("in", style({ opacity: 1, transform: "translateX(0)" })),
    transition("void => *", [
      style({ opacity: 0, transform: "translateX(100%)" }),
      animate(200)
    ]),
    transition("* => void", [
      animate(200, style({ opacity: 0, transform: "translateX(-100%)" }))
    ])
  ]
);
