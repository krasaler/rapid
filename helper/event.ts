import isUndefined from "https://deno.land/x/lodash/isUndefined.js";

const listings: any = [];

export const Listing = (action: string, type: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (isUndefined(listings[action])) {
      listings[action] = [];
    }
    listings[action].push({
      action: descriptor.value,
      type,
    });
  };
};

export const triggerEvent = async (
  action: string,
  type: string,
  args: any = {},
) => {
  if (listings[action]) {
    const result: any = listings[action].filter((
      value: any,
    ) => (value.type === type));
    for (const value of result) {
      await value.action(args);
    }
  }
};

export const Trigger = (action: string, type: string) => {
  return async (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    await triggerEvent(action, type);
  };
};
