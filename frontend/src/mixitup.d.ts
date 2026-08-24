declare module "mixitup" {
  // Описываем фабричную функцию, которая принимает селектор и конфиг
  function mixitup(container: string | HTMLElement, config?: any): any;
  export default mixitup;
}
