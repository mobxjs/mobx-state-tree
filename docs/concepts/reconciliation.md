
### How does reconciliation work?

-   When applying snapshots, MST will always try to reuse existing object instances for snapshots with the same identifier (see `types.identifier`).
-   If no identifier is specified, but the type of the snapshot is correct, MST will reconcile objects as well if they are stored in a specific model property or under the same map key.
-   In arrays, items without an identifier are never reconciled.

If an object is reconciled, the consequence is that localState is preserved and `afterCreate` / `attach` life-cycle hooks are not fired because applying a snapshot results just in an existing tree node being updated.
