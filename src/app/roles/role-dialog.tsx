import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Role, Permission } from './page';
import { useRoles } from '@/hooks/useRoles';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role;
  onSuccess: () => void;
}

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const { createRole, updateRole } = useRoles<Role>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create a clean initial permissions object
  const initialPermissions = {
    users: { read: false, write: false, delete: false, manage: false },
    roles: { read: false, write: false, delete: false, manage: false },
    settings: { read: false, write: false, delete: false, manage: false },
  };

  // Initialize form data with clean permissions
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role ? {
      users: {
        read: role.permissions.users.read || false,
        write: role.permissions.users.write || false,
        delete: role.permissions.users.delete || false,
        manage: role.permissions.users.manage || false,
      },
      roles: {
        read: role.permissions.roles.read || false,
        write: role.permissions.roles.write || false,
        delete: role.permissions.roles.delete || false,
        manage: role.permissions.roles.manage || false,
      },
      settings: {
        read: role.permissions.settings.read || false,
        write: role.permissions.settings.write || false,
        delete: role.permissions.settings.delete || false,
        manage: role.permissions.settings.manage || false,
      },
    } : initialPermissions,
  });

  const handlePermissionChange = (
    resource: keyof typeof initialPermissions,
    permission: keyof Permission,
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [resource]: {
          ...formData.permissions[resource],
          [permission]: checked,
        },
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      if (role) {
        await updateRole(role._id, formData);
        toast({
          title: "Success",
          description: "Role updated successfully",
        });
      } else {
        await createRole(formData);
        toast({
          title: "Success",
          description: "Role created successfully",
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save role",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] text-slate-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{role ? 'Edit Role' : 'Add Role'}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4">
              <Label>Permissions</Label>
              {Object.entries(formData.permissions).map(([resource, perms]) => (
                <div key={resource} className="space-y-2">
                  <h4 className="font-medium capitalize">{resource}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(perms).filter(([key]) => !key.startsWith('_')).map(([perm, value]) => (
                      <div key={perm} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${resource}-${perm}`}
                          checked={value}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              resource as keyof typeof initialPermissions,
                              perm as keyof Permission,
                              checked as boolean
                            )
                          }
                        />
                        <Label 
                          htmlFor={`${resource}-${perm}`} 
                          className="capitalize text-sm font-normal"
                        >
                          {perm}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {role ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                role ? 'Update Role' : 'Create Role'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 