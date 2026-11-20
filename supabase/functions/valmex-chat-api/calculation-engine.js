(function (root) {
  "use strict";
  function roofGeometry(state) {
    const L = Number(state.length) + 2 * Number(state.eave);
    const W = Number(state.width) + 2 * Number(state.eave);
    const pitch = Number(state.pitch) * Math.PI / 180;
    if (!L || !W || !Number.isFinite(pitch) || Math.cos(pitch) <= 0) return null;
    const halfSpan = Math.min(L, W) / 2;
    const ridgeLength = Math.max(0, Math.max(L, W) - Math.min(L, W));
    const slopeDepth = halfSpan / Math.cos(pitch);
    const rise = halfSpan * Math.tan(pitch);
    return { L, W, pitch, halfSpan, ridgeLength, slopeDepth, rise };
  }
  function area(state) {
    const g = roofGeometry(state);
    if (!g) return 0;
    if (Number(state.slopes) === 2) return 2 * Math.max(g.L, g.W) * g.slopeDepth;
    if (Number(state.slopes) === 4) {
      const longSide = Math.max(g.L, g.W), shortSide = Math.min(g.L, g.W);
      const ridge = Math.max(0, longSide - shortSide);
      const trapezoids = 2 * ((longSide + ridge) / 2) * g.slopeDepth;
      const triangles = 2 * (shortSide * g.slopeDepth / 2);
      return trapezoids + triangles;
    }
    return 0;
  }
  function wood(state) {
    const g = roofGeometry(state), A = area(state);
    if (!g) return { rafters: 0, counter: 0, battens: 0, total: 0 };
    const longSide = Math.max(g.L, g.W), shortSide = Math.min(g.L, g.W);
    const sectionRafter = .05 * .15, sectionCounter = .05 * .03, sectionBatten = .10 * .03;
    let rafterLengthTotal = 0, counterLengthTotal = 0, battenLengthTotal = 0;
    if (Number(state.slopes) === 2) {
      const pairs = Math.ceil(longSide / .8) + 1;
      rafterLengthTotal = pairs * 2 * g.slopeDepth;
      counterLengthTotal = rafterLengthTotal;
      const rows = Math.ceil(g.slopeDepth / .30) + 1;
      battenLengthTotal = rows * 2 * longSide;
    } else if (Number(state.slopes) === 4) {
      const ridge = Math.max(0, longSide - shortSide);
      const commonPairs = Math.ceil(ridge / .8) + 1;
      const commonLength = commonPairs * 2 * g.slopeDepth;
      const hipPlan = Math.sqrt((shortSide / 2) ** 2 + (shortSide / 2) ** 2);
      const hipLength = Math.sqrt(hipPlan ** 2 + g.rise ** 2);
      const hipTotal = 4 * hipLength;
      const endRafters = Math.ceil((shortSide / 2) / .8) * 2;
      const endCommonLength = endRafters * g.slopeDepth;
      rafterLengthTotal = commonLength + hipTotal + endCommonLength;
      counterLengthTotal = rafterLengthTotal;
      battenLengthTotal = A / .30;
    }
    const rafters = rafterLengthTotal * sectionRafter;
    const counter = counterLengthTotal * sectionCounter;
    const battens = battenLengthTotal * sectionBatten;
    return { rafters, counter, battens, total: rafters + counter + battens,
      rafterLengthTotal, counterLengthTotal, battenLengthTotal };
  }
  function commissions(state, settings) {
    return Number(settings.commission[state.months]) || 0;
  }
  function costs(state, settings) {
    const A = area(state), woodVol = wood(state);
    const roofIncluded = ["turnkey"].includes(state.type);
    const tile = (roofIncluded || state.type === "materials") ? A * settings.tileCost : 0;
    const accessories = roofIncluded ? tile * settings.accessoriesPercent / 100 : 0;
    const labor = roofIncluded ? A * settings.laborCost : (state.type === "install" ? A * settings.laborCost : 0);
    const consumables = roofIncluded ? settings.consumables : 0;
    const woodCost = roofIncluded ? woodVol.total * settings.woodCostPerM3 : 0;
    const beamPerimeter = 2 * (Number(state.length) + Number(state.width));
    const beamVol = state.beam === "yes" ? beamPerimeter * state.beamWidth * state.beamHeight : 0;
    const beamCost = beamVol * settings.beamCostPerM3, roofSale = A * Number(state.price);
    const masonryPerimeter = 2 * (Number(state.length) + Number(state.width));
    const masonryGrossArea = state.masonry === "yes" ? masonryPerimeter * (Number(state.masonryHeightCm) / 100) : 0;
    const masonryArea = Math.max(0, masonryGrossArea - Math.max(0, Number(state.openingsArea) || 0));
    const blockFaceArea = (Number(settings.blockLengthCm) / 100) * (Number(settings.blockHeightCm) / 100);
    const blockThickness = Number(settings.blockThicknessCm) / 100;
    const masonryVolume = masonryArea * blockThickness;
    const theoreticalBlocks = blockFaceArea > 0 ? Math.ceil(masonryArea / blockFaceArea) : 0;
    const blockCount = state.masonry === "yes" ? Math.ceil(theoreticalBlocks * (1 + Number(settings.blockWastePercent) / 100)) : 0;
    const blockCost = blockCount * Math.max(0, Number(state.blockPrice) || 0);
    const masonryLaborCost = masonryVolume * Math.max(0, Number(state.masonryLaborRate) || 0);
    const masonryCost = state.masonry === "yes" ? blockCost + masonryLaborCost : 0;
    const slabArea = state.slab === "yes" ? Number(state.length) * Number(state.width) : 0;
    const slabVolume = slabArea * (Math.max(0, Number(state.slabThickness) || 0) / 100);
    const concreteCost = slabVolume * Math.max(0, Number(state.concretePrice) || 0);
    const slabExtras = state.slab === "yes" ? (Math.max(0, Number(state.pumpCost) || 0) + Math.max(0, Number(state.slabOtherCost) || 0)) : 0;
    const slabCost = state.slab === "yes" ? concreteCost + slabExtras : 0;
    const baseWorkSale = state.type === "turnkey" ? roofSale : (state.type === "install" ? A * Number(state.price || 0) : A * Number(state.price || 0));
    const extraTotal = (Array.isArray(state.extraItems) ? state.extraItems : []).reduce((sum, it) => sum + Math.max(0, Number(it.price) || 0), 0);
    const sale = baseWorkSale + beamCost + masonryCost + slabCost + extraTotal;
    const commission = state.payment === "installments" ? sale * commissions(state, settings) / 100 : 0;
    const known = tile + accessories + (roofIncluded ? labor : state.type === "install" ? A * settings.laborCost : 0) +
      consumables + woodCost + beamCost + blockCost + masonryLaborCost + concreteCost + slabExtras +
      (state.payer === "valmex" ? commission : 0);
    const clientTotal = sale + (state.payment === "installments" && state.payer === "client" ? commission : 0);
    const firstPayment = state.payment === "installments" ? Math.max(0, Number(state.firstPayment) || 0) : 0;
    const financedBalance = Math.max(0, clientTotal - firstPayment);
    const monthlyBase = state.payment === "installments" && Number(state.months) > 0 ?
      Math.floor((financedBalance / Number(state.months)) * 100) / 100 : 0;
    const lastMonthly = state.payment === "installments" ?
      Math.round((financedBalance - monthlyBase * (Number(state.months) - 1)) * 100) / 100 : 0;
    return { A, roofSale, sale, extraTotal, tile, accessories, labor, consumables, woodVol, woodCost,
      beamVol, beamCost, commission, known, clientTotal, remaining: sale - known, beamPerimeter,
      masonryPerimeter, masonryGrossArea, masonryArea, masonryVolume, theoreticalBlocks, blockCount,
      blockCost, masonryLaborCost, masonryCost, slabArea, slabVolume, concreteCost, slabExtras,
      slabCost, firstPayment, financedBalance, monthlyBase, lastMonthly };
  }
  root.VALMEX_CALC = Object.freeze({ roofGeometry, area, wood, commissions, costs });
})(globalThis);
