"use client";

import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState } from 'react';

interface CreateJobApplicationDialogProps {
  columnId: string;
  boardId: string;
}

function CreateJobApplicationDialog({ columnId, boardId }:
  CreateJobApplicationDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState({
      company: '',
      position: '',
      location: '',
      salary: '',
      joburl: '',
      tags: '',
      description: '',
      notes: ''
    });

    async function handleSubmit(e: React.SubmitEvent) {
      e.preventDefault();
      
      try {
        
      } catch (err) {
        console.log(err)
      }
    };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button  variant="outline"
          className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
        >
          <Plus  className="mr-2 h-4 w-4"/>
          Add job
        </Button>
      </DialogTrigger>
      <DialogContent  className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Job Application</DialogTitle>
          <DialogDescription>Track your new job application</DialogDescription>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='company'>Company *</Label>
                <Input 
                  id="company" 
                  required 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='position'>Position *</Label>
                <Input id="position" required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input 
                  id="location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='salary'>Salary</Label>
                <Input 
                  id="salary" 
                  placeholder='e.g., $100k - $150k' 
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='joburl'>Job URL</Label>
              <Input 
                id="joburl" 
                placeholder='https://...' 
                value={formData.joburl}
                onChange={(e) => setFormData({...formData, joburl: e.target.value})}
              />
            </div>
             <div className='space-y-2'>
              <Label htmlFor='tags'>Tags (comma-seperated)</Label>
              <Input 
                id="tags" 
                placeholder='e.g., Python, React, JavaScript' 
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
             <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea 
              id="description"
              rows={3}
               placeholder='Brief description of the role' 
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              </div>
             <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea 
                id="notes" 
                rows={4} 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateJobApplicationDialog