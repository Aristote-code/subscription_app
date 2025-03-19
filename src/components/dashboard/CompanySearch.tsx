
import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Company = {
  id: string;
  name: string;
  country: string;
};

interface CompanySearchProps {
  onSelect: (company: Company) => void;
  value?: string;
  placeholder?: string;
}

const mockCompanies: Company[] = [
  { id: '1', name: 'Netflix', country: 'USA' },
  { id: '2', name: 'Spotify', country: 'Sweden' },
  { id: '3', name: 'Amazon Prime', country: 'USA' },
  { id: '4', name: 'Disney+', country: 'USA' },
  { id: '5', name: 'Hulu', country: 'USA' },
  { id: '6', name: 'YouTube Premium', country: 'USA' },
  { id: '7', name: 'Apple Music', country: 'USA' },
  { id: '8', name: 'HBO Max', country: 'USA' },
  { id: '9', name: 'Adobe Creative Cloud', country: 'USA' },
  { id: '10', name: 'Microsoft 365', country: 'USA' },
  { id: '11', name: 'Nintendo Switch Online', country: 'Japan' },
  { id: '12', name: 'PlayStation Plus', country: 'Japan' },
  { id: '13', name: 'Xbox Game Pass', country: 'USA' },
  { id: '14', name: 'Dropbox', country: 'USA' },
  { id: '15', name: 'Google One', country: 'USA' },
];

const CompanySearch = ({ onSelect, value = '', placeholder = 'Search for a company...' }: CompanySearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find the selected company if value is provided
  useEffect(() => {
    if (value) {
      const found = mockCompanies.find(company => company.name === value);
      if (found) {
        setSelectedCompany(found);
      } else if (value.trim() !== '') {
        // If not found in the list but value is provided, create a custom entry
        setSelectedCompany({
          id: 'custom',
          name: value,
          country: 'Custom',
        });
      }
    } else {
      setSelectedCompany(null);
    }
  }, [value]);

  // Search function with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim() === '') {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(() => {
      // In a real app, this would be an API call:
      // fetch(`/api/company-search?q=${encodeURIComponent(query)}`)
      //   .then(res => res.json())
      //   .then(data => setResults(data))
      //   .catch(err => console.error('Error searching companies:', err))
      //   .finally(() => setIsLoading(false));

      // For this demo, we'll filter the mock data
      const filteredResults = mockCompanies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    onSelect(company);
    setOpen(false);
  };

  const handleCustomValue = () => {
    if (query.trim() === '') return;
    
    const customCompany: Company = {
      id: 'custom',
      name: query,
      country: 'Custom',
    };
    
    handleSelect(customCompany);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCompany ? (
            <span className="flex items-center">
              {selectedCompany.name}
              {selectedCompany.country !== 'Custom' && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({selectedCompany.country})
                </span>
              )}
            </span>
          ) : (
            placeholder
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search companies..." 
            value={query}
            onValueChange={setQuery}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="py-6 text-center text-sm">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length === 0 ? (
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p>No companies found.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCustomValue}
                    disabled={query.trim() === ''}
                    className="mt-2"
                  >
                    Add "{query}"
                  </Button>
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup heading="Companies">
                {results.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => handleSelect(company)}
                    className="flex items-center justify-between"
                  >
                    <span>{company.name}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">
                        {company.country}
                      </span>
                      {selectedCompany?.id === company.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CompanySearch;
