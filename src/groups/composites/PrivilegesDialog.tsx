import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPrivilegeFlagsOf,
  GroupUser,
  PrivilegeFlags,
  privilegeToLabel,
} from "../../models/GroupUser";
import { Dialog, DialogButtonDescription } from "../../share/stables/Dialog";
import { TriCheckbox } from "../../share/stables/TriCheckbox";

export const PrivilegesDialog: React.FC<{
  gUsers: GroupUser[];
  isOpen: boolean;
  onOk: (result: PrivilegeFlags[] | null) => void;
}> = ({ gUsers, isOpen, onOk }) => {
  const [pFlags, setPFlags] = useState<PrivilegeFlags[]>([]);
  const initialPFlags = useMemo(() => getPrivilegeFlagsOf(gUsers), [gUsers]);

  const buttons = useMemo<DialogButtonDescription[]>(
    () => [
      {
        callback: () => {
          onOk(null);
        },
        label: "Cancel",
      },
      {
        callback: () => {
          onOk(pFlags);
        },
        label: "OK",
      },
    ],
    [onOk, pFlags]
  );

  const onRequestClose = useCallback(() => {
    onOk(null);
  }, [onOk]);

  const onCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, name: privilege } = event.currentTarget;
      const pair = pFlags.find(([v]) => v === privilege);
      if (!pair) {
        throw new Error(`Unknown privilege tag "${privilege}"`);
      }

      pair[1] = checked;
      setPFlags([...pFlags]);
    },
    [pFlags]
  );

  useEffect(() => {
    setPFlags([...initialPFlags]);
  }, [initialPFlags]);

  return (
    <Dialog
      buttons={buttons}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Update user privileges"
    >
      {pFlags.map(([privilege, flag]) => (
        <TriCheckbox
          checked={flag}
          id={privilege}
          key={privilege}
          label={privilegeToLabel(privilege)}
          name={privilege}
          onChange={onCheckboxChange}
        />
      ))}
      <p>
        <small className="text-muted">
          {"Assigning to: "}
          {gUsers.map(({ user }) => user.name).join(", ")}
        </small>
      </p>
    </Dialog>
  );
};
