import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers, useUpdateUserRole, useUpdateUserProfile, useDeleteUser, useBulkDeleteUsers, useBulkAssignRole } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCog, Trash2, Shield, Download, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AVAILABLE_ROLES = ['admin', 'moderator', 'user'];

export default function UsersManagement() {
  const { t } = useTranslation();
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const updateProfile = useUpdateUserProfile();
  const deleteUser = useDeleteUser();
  const bulkDeleteUsers = useBulkDeleteUsers();
  const bulkAssignRole = useBulkAssignRole();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkRoleDialogOpen, setBulkRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const [formData, setFormData] = useState({ full_name: '', avatar_url: '' });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name || '',
      avatar_url: user.avatar_url || ''
    });
    setEditDialogOpen(true);
  };

  const handleManageRoles = (user: any) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleSaveProfile = () => {
    if (selectedUser) {
      updateProfile.mutate({
        userId: selectedUser.id,
        ...formData
      });
      setEditDialogOpen(false);
    }
  };

  const handleToggleRole = (role: 'admin' | 'moderator' | 'user') => {
    if (selectedUser) {
      const hasRole = selectedUser.roles.includes(role);
      updateRole.mutate({
        userId: selectedUser.id,
        role,
        action: hasRole ? 'remove' : 'add'
      });
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser.mutate(selectedUser.id);
      setDeleteDialogOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(u => u.id) || []);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const confirmBulkDelete = () => {
    bulkDeleteUsers.mutate(selectedUsers);
    setSelectedUsers([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkRoleAssign = () => {
    if (selectedUsers.length > 0) {
      setBulkRoleDialogOpen(true);
    }
  };

  const confirmBulkRoleAssign = () => {
    bulkAssignRole.mutate({ userIds: selectedUsers, role: bulkRole });
    setSelectedUsers([]);
    setBulkRoleDialogOpen(false);
  };

  const exportToCSV = () => {
    if (!users) return;
    
    const headers = ['Email', 'Full Name', 'Roles', 'Created At'];
    const rows = users.map(user => [
      user.email,
      user.full_name || '',
      user.roles.join(', '),
      format(new Date(user.created_at), 'MMM d, yyyy')
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('users.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('users.description')}</p>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Users className="h-5 w-5" />
          <span className="font-medium">{selectedUsers.length} {t('users.selected')}</span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkRoleAssign}>
              <Shield className="h-4 w-4 mr-1" />
              {t('users.assignRole')}
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" />
              {t('users.exportCSV')}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              {t('users.bulkDelete')}
            </Button>
          </div>
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users?.length && users.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>{t('users.email')}</TableHead>
              <TableHead>{t('users.fullName')}</TableHead>
              <TableHead>{t('users.roles')}</TableHead>
              <TableHead>{t('users.createdAt')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>{user.full_name || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map((role) => (
                      <Badge key={role} variant={role === 'admin' ? 'destructive' : 'secondary'}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageRoles(user)}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {t('users.roles')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <UserCog className="h-4 w-4 mr-1" />
                      {t('common.edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.editProfile')}</DialogTitle>
            <DialogDescription>{t('users.updateProfile')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t('users.fullName')}</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">{t('users.avatarUrl')}</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSaveProfile}>{t('common.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Roles Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.manageRoles')}</DialogTitle>
            <DialogDescription>
              {t('users.assignRolesFor')} {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {(AVAILABLE_ROLES as Array<'admin' | 'moderator' | 'user'>).map((role) => {
              const hasRole = selectedUser?.roles.includes(role);
              return (
                <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={hasRole ? (role === 'admin' ? 'destructive' : 'secondary') : 'outline'}>
                      {role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {role === 'admin' && t('users.fullSystemAccess')}
                      {role === 'moderator' && t('users.limitedAdminAccess')}
                      {role === 'user' && t('users.basicUserAccess')}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={hasRole ? 'destructive' : 'default'}
                    onClick={() => handleToggleRole(role)}
                  >
                    {hasRole ? t('users.remove') : t('users.add')}
                  </Button>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>{t('common.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteMessage')} {selectedUser?.email}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.deleteMultipleMessage', { count: selectedUsers.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Role Assignment Dialog */}
      <Dialog open={bulkRoleDialogOpen} onOpenChange={setBulkRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.bulkRoleTitle')}</DialogTitle>
            <DialogDescription>
              {t('users.bulkRoleDescription', { count: selectedUsers.length })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('users.selectRole')}</Label>
              <Select value={bulkRole} onValueChange={(value: 'admin' | 'moderator' | 'user') => setBulkRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkRoleDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={confirmBulkRoleAssign}>{t('users.assignRole')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}