type SlCollapseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-collapse': SlCollapseEvent;
  }
}

export default SlCollapseEvent;
